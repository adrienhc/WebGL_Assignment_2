window.Assignment_Two_Test = window.classes.Assignment_Two_Test =
class Assignment_Two_Test extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),

                          sun: new Subdivision_Sphere (4), //ambient == 1                        
                          icy_gray: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() )(2), // diffuse only
                          swampy: new Subdivision_Sphere (3), //max specular, low diffuse
                          muddy: new Subdivision_Sphere (4), //max diffuse, max specular
                          muddy_ring: new Torus(15,15),
                          soft_blue: new Subdivision_Sphere (4), //high specular
                          moon: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (1),
                          grid: new (Grid_Sphere.prototype.make_flat_shaded_version() ) (10, 10)
                                         
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            sun_m:      context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), {ambient:1}),  //ambient = 1
            icy_gray_m: context.get_instance( Phong_Shader ).material( Color.of(0.5,0.54,0.53,1), {ambient:0}, {specular:0}), //diffuse only
            swampy_m:   context.get_instance( Phong_Shader ).material( Color.of(0.1,0.47,0.24,1), {ambient:0}, {specular:1}, {diffuse:0.2}, {gouraud:0}), //max specular, low diffuse
            muddy_m:  context.get_instance( Phong_Shader ).material( Color.of(0.90, 0.70, 0.40, 1), {ambient:0}, {specular:1}, {diffuse:1}), //max diffuse, max specular
            ring_m:  context.get_instance( Ring_Shader ).material( Color.of(0.90, 0.70, 0.40, 1), {ambient:0}, {specular:1}, {diffuse:1}), //EXTRA CREDIT 2 Shader
            soft_blue_m: context.get_instance( Phong_Shader ).material( Color.of(0.04, 0.19, 0.58, 1), {ambient:0}, {specular:0.8}, {diffuse:0} ),
            moon_m: context.get_instance( Phong_Shader ).material( Color.of(0.11, 0.53, 0.15, 1), {ambient:0}, {specular:0.7}, {diffuse:0.2}),
            icy_gray_m: context.get_instance( Phong_Shader ).material( Color.of(0.81,0.81,0.81,1), {ambient:0}, {specular:1}, {diffuse:1}), //EXTRA CREDIT 3

          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;       
        let model_transform = Mat4.identity();
        let PI = 3.1415;

        //SUN AND LIGHGT BUSINESS
       let delta_sun = 2*Math.abs(Math.sin(t/2.5));
       let sun_transform = model_transform.times( Mat4.scale([ 1 + delta_sun , 1 + delta_sun, 1 + delta_sun ] )) ;
       let sun_color = Color.of(Math.abs(Math.sin(t/2.5)), 0, Math.abs(Math.cos(t/2.5)), 1);
       let white = Color.of(1,1,1,1);
       this.shapes.sun.draw( graphics_state, sun_transform, this.materials.sun_m.override( {color: sun_color} ) ) ;
       this.lights[0] = new Light (Vec.of(0,0,0,1), sun_color, 10**(1+delta_sun));


        //ICY GRAY PLANET
       let icy_gray_transform = model_transform.times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([5,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
       this.shapes.icy_gray.draw(graphics_state, icy_gray_transform, this.materials.icy_gray_m);
      
        //SWAMPY PLANET
       let swampy_transform = model_transform.times(Mat4.rotation(0.6*t,Vec.of(0,1,0))).times(Mat4.translation([8,0,0])).times(Mat4.rotation(0.9*t,Vec.of(0,1,0)));
       this.shapes.swampy.draw(graphics_state, swampy_transform, this.materials.swampy_m.override({gouraud: t%2})); //even time gouraud = 0 off  //odd time gouraud = 1 on

      
        //MUDDY PLANET
        let muddy_transform = model_transform.times(Mat4.rotation(0.5*t,Vec.of(0,1,0))).times(Mat4.translation([11,0,0])).times(Mat4.rotation(0.8*t,Vec.of(0,1,0))).times(Mat4.rotation((PI/2)+0.8*Math.sin(t), Vec.of(1,0,0)));
        this.shapes.muddy.draw(graphics_state, muddy_transform, this.materials.muddy_m );
        this.shapes.muddy_ring.draw(graphics_state, muddy_transform.times(Mat4.scale([1,1,0])), this.materials.ring_m); //to flatten the ring -- Extra Credit 2 Shader

        //SOFT BLUE AND MOON
        let soft_transform = model_transform.times(Mat4.rotation(0.4*t, Vec.of(0,1,0))).times(Mat4.translation([14,0,0])).times(Mat4.rotation(0.7*t,Vec.of(0,1,0)));
        let moon_transform = model_transform.times(Mat4.rotation(0.4*t, Vec.of(0,1,0))).times(Mat4.translation([14,0,0])).times(Mat4.rotation(0.8*t, Vec.of(0,1,0))).times(Mat4.translation([1.2,0,1.2])).times(Mat4.rotation(t,Vec.of(0,1,0))); //times(Mat4.translation([1.2,0,1.2]));
        this.shapes.soft_blue.draw(graphics_state, soft_transform, this.materials.soft_blue_m);
        this.shapes.moon.draw(graphics_state, moon_transform, this.materials.moon_m); 

        //GRID SPHERE -- Extra Credit 3
        let grid_transform = model_transform.times(Mat4.rotation(0.3*t, Vec.of(0,1,0))).times(Mat4.translation([17,0,0])).times(Mat4.rotation(0.6*t,Vec.of(0,1,0)));
        this.shapes.grid.draw(graphics_state, grid_transform, this.materials.icy_gray_m );

        //CAMERA 
        this.planet_1 = icy_gray_transform;
        this.planet_2 = swampy_transform;
        this.planet_3 = muddy_transform;
        this.planet_4 = soft_transform;
        this.planet_5 = model_transform;
        this.moon = moon_transform;
        this.planet_5 = grid_transform; //Extra Credit 3

        if (this.attached != undefined )
        {
          let desired = this.attached();
          desired = Mat4.inverse(desired.times(Mat4.translation([0,0,5])));        
          graphics_state.camera_transform = desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 0.1 ) ); //Extra Credit 1
          
        } 
      }
  }



window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
              const float FACT = 25.0;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
         gl_Position = projection_camera_transform * model_transform * vec4( object_space_pos, 1);
         position =  model_transform * vec4( object_space_pos, 1);
         center = model_transform * vec4( 0, 0, 0, 1); 
        }`;    
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
            gl_FragColor =  sin(FACT * distance(center, position)) * vec4 (0.90, 0.70, 0.40, 1);         
            return;
        }`;   
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        const circle_points = Array( rows ).fill( Vec.of( 0,0,-1 ) )
                                           .map( (p,i,a) => Mat4.rotation( i/(a.length-1) * Math.PI, Vec.of( 0,-1,0 ) ) 
                                                    .times( p.to4(1) ).to3() ) ;

        Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] ); 

      } }

      //ALL DONE